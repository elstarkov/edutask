import pytest
import unittest.mock as mock
from pymongo.errors import WriteError
from unittest.mock import patch

from src.util.dao import DAO


class TestCreate:
    """create fixture and inject it into every test as 'sut'"""
    @pytest.fixture
    def sut(self):
        #mock the getValidator to hardcode it's outcome when used in DAO
        with mock.patch('src.util.dao.getValidator', autospec=True) as mocked_validator:

            #set random collection name
            collection_name = "test_collection"

            #mock the schema instead of creating a real json-file
            schema = {
                "$jsonSchema": {
                    "bsonType": "object",
                    "required": ["test_string", "test_bool"],
                    "properties": {
                        "test_string": {
                            "description": "String required",
                            "bsonType": "string",
                            "uniqueItems": True
                        },
                        "test_bool": {
                            "description": "Boolean (bool) required",
                            "bsonType": "bool"
                        },
                    },
                }
            }

            mocked_validator.return_value = schema

            #DAO doesn't need to be mocked. It connects to the real DB on initiation
            #The important part is to drop the collection after the test
            sut = DAO(collection_name=collection_name)

            #use yield to drop collection after tests are completed
            yield sut

            sut.collection.drop()

    """test create with valid parameters"""
    @pytest.mark.parametrize('data',
        [
            ({'test_string': "string", 'test_bool': True})
        ]
    )
    @pytest.mark.integration
    def test_create_valid(self, sut, data):
        #expected keys to be in the result
        result = sut.create(data)

        # Unpack data param and combine with _id from db (like ...data in JS)
        expected_dict = {'_id': result.get("_id"), **data}

        #result is expected to contain the expected_dict, which is the data param + the _id from the collection
        assert result == expected_dict

    """test create with wrong datatype, missing required parameters"""
    @pytest.mark.parametrize('data',
        [
            ({'test_string': 17, 'test_bool': True}), #wrong datatype
            ({'test_string': "string"}), #missing required parameter
        ]
    )
    @pytest.mark.integration
    def test_create_not_valid(self, sut, data):
        with pytest.raises(WriteError):
            sut.create(data)

    """test create with non-unique value"""
    @pytest.mark.parametrize('data',
        [
            ({'test_string': "string", 'test_bool': True})
        ]
    )
    @pytest.mark.integration
    def test_create_not_unique(self, sut, data):
        #create an object
        sut.create(data)

        #create another object with the same value for 'test_string' which is marked as uniqueItems = True
        #should raise WriteError - it doesn't, alert the developers to change initial code...
        with pytest.raises(WriteError):
            sut.create(data) #