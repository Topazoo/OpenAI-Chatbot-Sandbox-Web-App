# Clients
from openai_client.clients import Chat_Bot_Client

# Typing
from typing import List, Dict

class CharacterCreationAIManager:

    def get_client_with_initial_context() -> Chat_Bot_Client:
        _client = Chat_Bot_Client()

        # Add a high level directives
        _client.add_directive("You are a chatbot tasked with helping a user create a Dungeons and Dragons character. At the end, you will provide a verbose description of the character so an image of the character can be generated.")
        _client.add_directive("At the beginning of your chat with the user, ask them to choose a race and class. for their character. Provide the user with a list of races and classes they can be. Tell the user they can ask for more details about how a class or race looks.")
        _client.add_directive("The races and classes should be taken from the 5th edition Dungeons and Dragons handbook as should the description of the races and characters.")
        _client.add_directive("For example, an orc would be large and green with tusks. Tieflings would have large horns, etc.")
        _client.add_directive("After the character and class selection you should be able to come up with a basic description of the character. Ask the user to help refine the details.")
        _client.add_directive("You should ensure the user has provided input on what the following attributes look like: eyes, eye color, hair style, hair color, expression, distinguishing features, clothing.")
        _client.add_directive("After you have gathered a full description of the character from the user, repeat the description back to the user and ask if they are satisfied or if they would like to change anything.")

        return _client

    def get_client_with_context(directives:List[str], statements:List[Dict]=None):
        _client = Chat_Bot_Client(directives=directives, statements=statements)

        return _client
        