import os
import csv
import sys
import gspread

from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

print('Started uploadSheet.py')

SCOPES = ["https://www.googleapis.com/auth/drive"]
SPREADSHEET_ID = "1vI_ho-gpw4xq_VTRyTMB3DdNAytWdckrDANbJ1BEcMU"

def init_service():
    global creds
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)) + '\credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    global service
    service = build("sheets", "v4", credentials=creds)

    global client
    client = gspread.authorize(creds)

    print("Done initializing service")

def insert_sheet(path, name):
    sh = client.open_by_key(SPREADSHEET_ID)
    sh.add_worksheet(title=name, rows="100", cols="20")
    sh.values_update(
        name,
        params={"valueInputOption": "USER_ENTERED"},
        body={"values": list(csv.reader(open(path), delimiter="\t"))},
    )
    print("Done inserting sheet: " + name)

path = sys.argv[1]
name = path.rsplit("\\", 1)[1].rsplit(".", 1)[0]
if not path or not name:
    print("Please specify a path to the file to upload")
    exit(1)
else:
    init_service()
    insert_sheet(path, name)
