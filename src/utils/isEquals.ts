const _ = require('lodash');

export const isObjectEqual =(obj1: object, obj2: object) : boolean =>{
    return _.isEqual(obj1, obj2);
}