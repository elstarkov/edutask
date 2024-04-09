import pytest
import unittest.mock as mock

from src.controllers.usercontroller import UserController

@pytest.mark.unit
def test_get_user_by_email_invalid_email():
    """Test that an invalid email returns ValueError"""

    email = "jane.done[2]gmail.com"

    mock_user = [{"email": email}]

    mock_dao = mock.MagicMock()
    mock_dao.find.return_value = [mock_user]

    user_controller = UserController(dao=mock_dao)

    with pytest.raises(ValueError): #check that valueError is raised when email is not in valid format
        user_controller.get_user_by_email(email=email)

@pytest.mark.unit
def test_get_user_by_email():
    """Test that a user is found"""

    email = "jane.done@gmail.com"

    mock_user = {"email": email}

    mock_dao = mock.MagicMock()
    mock_dao.find.return_value = [mock_user]

    user_controller = UserController(dao=mock_dao)

    user = user_controller.get_user_by_email(email=email)

    assert user == mock_user #check that the expected user is returned

@pytest.mark.unit
def test_get_no_user():
    """Test that NO user is found"""

    email = "jane.done@gmail.com"

    mock_user = []

    mock_dao = mock.MagicMock()
    mock_dao.find.return_value = [mock_user]

    user_controller = UserController(dao=mock_dao)

    user = user_controller.get_user_by_email(email=email)
    assert user is None #if no user is found, None should be returned

@pytest.mark.unit
def test_get_many_users_and_print_warning():
    """Test that if many users are found, a warning is printed"""

    email = "jane.done@gmail.com"
    user = "jane_doe"
    user2 = "jane_doe_1337"

    mock_user = {"user": user,"email": email}
    mock_user2 = {"user": user2, "email": email}

    mock_users = [mock_user, mock_user2]

    mock_dao = mock.MagicMock()
    mock_dao.find.return_value = mock_users

    with mock.patch('builtins.print') as mock_print:
        user_controller = UserController(dao=mock_dao)
        user = user_controller.get_user_by_email(email=email)

        #check the warning is printed when more than 1 users are found
        mock_print.assert_called_once_with(f'Error: more than one user found with mail {email}')

    assert user == mock_user #check that returned user is the first result


@pytest.mark.unit
def test_database_operation_fail():
    """Test that a failed db-operation raises Exception"""

    email = "jane.done@gmail.com"

    mock_dao = mock.MagicMock()
    mock_dao.find.side_effect = Exception

    user_controller = UserController(dao=mock_dao)

    with pytest.raises(Exception): #check that Exception is raised when email is not in valid format
        user_controller.get_user_by_email(email=email)