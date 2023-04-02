''' Main route logic for handling AI requests '''

# Utils
from .utils import update_chat, get_or_create_chat


# Typing
from flask import Request
from pymongo.collection import Collection


def POST(request:Request, payload:dict, collection:Collection):
    ''' Respond to a chat '''

    response = update_chat(payload, collection)

    return {"data": response}


def GET(request:Request, payload:dict, collection:Collection):
    chat = get_or_create_chat(payload, collection)
    
    return {"data": chat["statements"], "_id": chat["_id"]}
