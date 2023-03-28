# Clients
from openai_client.clients import Chat_Bot_Client

# Framework
from dead_simple_framework import Database

# Typing
from typing import List, Dict

class CharacterCreationAIManager:

    def get_client_with_initial_context() -> Chat_Bot_Client:
        _client = Chat_Bot_Client()

        with Database(collection='config') as config_db:
            directives = dict(config_db.find_one({"name": "DIRECTIVES"})).get("value")
            
            for directive in directives:
                # Add high level directives
                _client.add_directive(directive)

        return _client

    def get_client_with_context(directives:List[str], statements:List[Dict]=None):
        _client = Chat_Bot_Client(directives=directives, statements=statements)

        return _client
        