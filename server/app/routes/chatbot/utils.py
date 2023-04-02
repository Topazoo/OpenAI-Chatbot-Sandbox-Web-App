# Clients
from .client_manager import get_client_with_context, get_client_with_directive_context

# Exceptions
from dead_simple_framework.api import JsonError

# Typing
from pymongo.collection import Collection, ObjectId

def create_new_chat(payload:dict, collection:Collection):
    client = get_client_with_directive_context(payload.get('directive_id'))

    try:
        client.run_prompt()
    except Exception as e:
        return JsonError({"error": str(e), "context": client.get_context()})
    
    chat_payload = {
        "_id": ObjectId(payload.get("chat_id")),
        "user_id": payload.get("user_id"),
        "directives": client.get_directives(),
        "statements": client.get_statements(),
    }
    
    return {
        **chat_payload,
        **{"_id": collection.insert_one(chat_payload).inserted_id}
    }


def get_or_create_chat(payload:dict, collection:Collection):
    """
    Check if a chat exists and create it if not
    """

    chat = get_chat(payload, collection, False)

    if not chat:
        chat = create_new_chat(payload, collection)

    return chat


def get_chat(payload:dict, collection:Collection, must_exist:bool=True):
    
    result = collection.find_one({"_id": ObjectId(payload.get('chat_id')), "user_id": payload.get("user_id")})

    if not result and must_exist:
        return JsonError(f"Could not find chat with ID [{payload.get('chat_id')}]")
    
    return result


def update_chat(payload:dict, collection:Collection) -> str:
    """ Update chat with user input """

    chat = get_chat(payload, collection)        
    client = get_client_with_context(chat["directives"], chat["statements"])
        
    client.add_statement("user", payload.get('user_chat'))
    result = client.run_prompt()

    collection.update_one({"_id": ObjectId(payload.get("chat_id"))}, {
        "$set": {"statements": client.get_statements()}
    })

    return result
    