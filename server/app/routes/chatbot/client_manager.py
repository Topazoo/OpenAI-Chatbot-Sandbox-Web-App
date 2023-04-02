# Clients
from openai_client.clients import Chat_Bot_Client

# Framework
from dead_simple_framework import Database

# Typing
from pymongo.collection import ObjectId
from typing import List, Dict


def get_client_with_directive_context(directive_id:str) -> Chat_Bot_Client:
    with Database(collection='directives') as directives_db:
        directive_data = dict(directives_db.find_one({"_id": ObjectId(directive_id)}))

    _client = Chat_Bot_Client(directives=directive_data["directives"], statements=None)

    return _client


def get_client_with_context(directives:List[str], statements:List[Dict]=None):
    _client = Chat_Bot_Client(directives=directives, statements=statements)

    return _client
