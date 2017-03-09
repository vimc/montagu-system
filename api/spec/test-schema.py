#!/usr/bin/env python3
import os.path
import sys
import json
import jsonschema
import re

def check_example(schema_path, example):
    schema_dir = os.path.abspath(schema_path).replace('\\', '/')
    with open(schema_path, 'r') as f:
        schema = json.load(f)
    
    resolver = jsonschema.RefResolver(base_uri = 'file:///' + schema_dir, referrer = schema)
    jsonschema.validate(example, schema, resolver = resolver)

def get_next(iterator):
    try:
        return next(iterator)
    except StopIteration: 
        return None

def get_next_non_blank(iterator):
    line = " "
    while line.isspace():
        line = get_next(iterator)
    return line

def get_example(lines):
    next_line = get_next_non_blank(lines)
    if re.match("#* ?Example$", next_line):
        return get_example_body(lines)
    else:
        return None

def get_example_body(lines):
    line = get_next_non_blank(lines)
    json = ""
    while is_preformatted(line):
        json += line[4:]
        line = get_next(lines)
    if json.isspace():
        return None
    else:
        return json

def is_preformatted(line):
    return line[0:4].isspace() and (not line.isspace())

def validate(url, example):
    print("Checking [{}] against {}".format(url, example.strip()))
    data = json.loads(example)
    check_example(url, data)    

def check_spec(spec_path):
    with open(spec_path, 'r') as f:
        spec = f.readlines()
    pattern = re.compile("Schema: \[.+\]\((?P<url>.+)\)$", flags=re.MULTILINE) # \[`(\w|\.)+`\]\((\w|\.+)\)
    lines = iter(spec)
    line = get_next(lines)
    while line:
        match = pattern.match(line)
        if match:
            url = match.group('url')
            example = get_example(lines)
            if example:
                validate(url, example)        
            else:
                print("No example given for {}".format(url))
        
        line = get_next(lines)


#schema_path = sys.argv[1]
#example_path = sys.argv[2]
#with open(example_path, 'r') as f:
#    example = json.load(f)

#check_example(schema_path, example)

spec_path = "spec.md"
check_spec(spec_path)
print("Finished without errors ☺")
