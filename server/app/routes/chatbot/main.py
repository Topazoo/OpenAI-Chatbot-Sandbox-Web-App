''' Main route logic for handling AI requests '''

from .client_manager import CharacterCreationAIManager

from dead_simple_framework.api import JsonError

# Typing
from flask import Request
from pymongo.collection import Collection, ObjectId


def POST(request:Request, payload:dict, collection:Collection):
    ''' Create a new chat '''

    chat_id = payload.get("chat_id")
    chat_name = payload.get("chat_name")
    user_id = payload.get('user_id')

    if not chat_id:
        # Create a new chat
        client = CharacterCreationAIManager.get_client_with_initial_context()
        result = client.run_prompt()
        chat_id = collection.insert_one({
            "user_id": ObjectId(user_id),
            "chat_name": chat_name,
            "directives": client.get_directives(),
            "statements": client.get_statements(),
        }).inserted_id
    
    else:
        user_chat = payload.get('user_chat')
        current_chat = collection.find_one({"_id": ObjectId(chat_id)})
        if not current_chat:
            return JsonError(f"Could not find chat with ID [{chat_id}]")
        
        client = CharacterCreationAIManager.get_client_with_context(current_chat["directives"], current_chat["statements"])
        
        client.add_statement("user", user_chat)
        result = client.run_prompt()

        collection.update_one({"_id": ObjectId(chat_id)}, {
            "$set": {"statements": client.get_statements()}
        })

    return {"data": result, "_id": chat_id}


def GET(request:Request, payload:dict, collection:Collection):
    chat_id = payload.get("chat_id")
    user_id = payload.get('user_id')

    include_directives = payload.get("include_directives", "True").lower() == "true"

    current_chat = collection.find_one({"_id": ObjectId(chat_id), "user_id": ObjectId(user_id)})

    if not current_chat:
        return JsonError(f"Chat ID [{chat_id}] not found!")
    
    data =  current_chat["statements"]

    if include_directives:
        data = current_chat["directives"] + data
    
    return {"data": data, "_id": chat_id, "chat_name": current_chat["chat_name"]}
