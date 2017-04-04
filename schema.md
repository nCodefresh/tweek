---
layout: page
title: Identities, properties and schema
permalink: /schema/
---

## Identities, properties and schema

Tweek allow to define schema for identities and their properties using special tweek keys.  
Usually, we'll want to add identities and properties for our domain, for example adding the property 'level' to identity 'user'
can be suited for gaming domain.

In order to do that, we can define new key:  
`@tweek/context/user/level/type`  
with the default value: number  

This means we've just added a new property for our schema 'user.level' which use the type "number" (allow any json based number).    
Types that allowed are as follows:
- all primitve json types: string, number, bool
- date type
- external types defined under @tweek/custom/types/{typename}
- custom

If we are using custom, there should be another key
at `@tweek/context/user/level/custom_type`, with value specifying the custom type. 
for example:
https://github.com/Soluto/tweek/tree/master/services/git-service/BareRepository/source/rules/%40tweek/context/device/device_os_type

### Custom types
A custom type is a json value with the following properties:
```
{
    "base": "can be any other primitive type", //required
    "allowedValues": ["value1", "value2"], //optional - array that limit the number of options
    "comparer": "comparername", //optional, required to support additional comparison operators as >, <. (comparer need to be registered in api)
    "validation": "some regex string", //optional - regex for validating input, currently not used by editor/api
}
```


When using external types, the json properties are defined as tweek keys.
For example: https://github.com/Soluto/tweek/tree/master/services/git-service/BareRepository/source/rules/%40tweek/custom_types/version
