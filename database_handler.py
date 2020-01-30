import database_common
from datetime import datetime


@database_common.connection_handler
def save_user_to_database(cursor, username, email, password):
    query = """
                    INSERT INTO users(username, email, password)
                    VALUES ( %(username)s, %(email)s, %(password)s);
    """
    cursor.execute(query, {'username': username,  'email': email, 'password': password})


@database_common.connection_handler
def get_hashed_password_from_db(cursor, username):
    query = """
                    SELECT password FROM users 
                     WHERE username = %(username)s;
    """
    cursor.execute(query, {'username': username})
    hashed_pass = cursor.fetchone()
    # use the tobytes() to change the stored bytes password to bytes not a memoryview as it is returned
    return hashed_pass['password'].tobytes() if hashed_pass else None


@database_common.connection_handler
def write_vote_data_to_database(cursor, planet_id, planet_name, user_id):
    submission_time = datetime.now()
    query = """
                INSERT INTO votes(id,planet_id, planet_name, user_id, submission_time) 
                VALUES(DEFAULT, %(planet_id)s, %(planet_name)s, %(user_id)s, %(submission_time)s);
    """
    cursor.execute(query, {'planet_id': planet_id, 'planet_name': planet_name, 'user_id': user_id,
                           'submission_time': submission_time})


@database_common.connection_handler
def get_user_id(cursor, username):
    query = """
            SELECT id FROM users WHERE username = %(username)s;
    """
    cursor.execute(query, {'username': username})
    return cursor.fetchone()['id']


@database_common.connection_handler
def get_vote_statistics(cursor):
    query = """SELECT planet_name AS planet, count(planet_name) AS votes
               FROM votes
               GROUP BY planet_name
               ORDER BY planet_name;"""
    cursor.execute(query)
    return cursor.fetchall()

#
# def main():
#    print(get_vote_statistics())
#
#
# if __name__ == '__main__':
#     main()
