''' Main route logic for handling users '''

# Core logic
from dead_simple_framework.handlers import UserRouteHandler

# Database
from dead_simple_framework import Database

# Errors
from dead_simple_framework.api import JsonError

# Typing
from flask import Request
from pymongo.collection import Collection
from datetime import datetime


def POST(request:Request, payload:dict, collection:Collection):
    ''' Logic for handling POST requests for users '''

    with Database(collection='config') as config_db:
        if(dict(config_db.find_one({"name": "ALLOW_NEW_USER_SIGNUPS"})).get("value")):
            payload['createdOn'] = datetime.now()
            return UserRouteHandler.POST(request, payload, collection)
        
    return JsonError("New user signups are currently not allowed - Please contact Peter", 401)
