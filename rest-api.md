---
layout: page
title: Rest-Api
permalink: /rest-api/
---

Tweek provides REST api for getting key values, and writing context properties.

### Getting single key value
```
GET http://my-tweek.host/api/v1/keys/{keyPath}?{context}
```
Parameters:
- keyPath - the full path to the key. (path/to/key)
- context - a set of identities and properties, identities are encoded as {identityType}={identityIdentifier} such as:
`user=5`
properties are encoded as {identityType.propType}={propValue} such as:
`user.age=25`
In most cases, there's no need to specify both identities and properties since Tweek automatically retrieve properties based on identities.   
Return value is a json value representing the key value for the requested context.
If there's no matching value, a "null" string is returned

### Getting multiple key value (list)
```
GET http://my-tweek.host/api/v1/keys/{keyPath}/_?{context}[$flatten=true][$include=path/to/key1&$include=path/to/inner_path/_&...]
```
The parameters are basically the same as a single get.  
The only different is with the return value.  
If there are matching keys (every key that start with keypath) we will get a json tree containing the relevant keys.  
Adding the flatten operator will change the response to a single-level json object.  
All the paths in the JSON tree or object are relative to the requested keypath.
If one or more $include modifiers are specified, Tweek will return result containing only the included paths. (similar to projection/select in databases)

### Adding data to context
```
POST http://my-tweek.host/api/v1/context/{identityType}/{identityValue}
{
    [{propName}]: {propValue}
    [@fixed:{keyPath}] : {keyValue}
}
```
Adding data to context can be used for adding new data on identity, for example:
```
POST http://my-tweek.host/api/v1/context/user/john_a@email.org
{
    "age": 24,
    "country": "UK"
}
```
Or override specfic key value for the identity:
```
POST http://my-tweek.host/api/v1/context/user/john_a@email.org
{
    @fixed:path/to/key : "somevalue"
}
```
