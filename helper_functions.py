import bcrypt
import requests
import database_handler
import datetime


def handle_next_or_previous_page(form_obj):
    if form_obj.get('previous'):
        url = form_obj.get('previous')
    else:
        url = form_obj.get('next')
    return url


def handle_registration(form_data):
    username = form_data['username']
    password = form_data['password']
    email = form_data['email']
    save_to_database(username, email, password)


def handle_login(form_data):
    username = form_data['username']
    hashed_password = database_handler.get_hashed_password_from_db(username)
    return hashed_password if hashed_password else None


def save_to_database(username, email, password):
    hashed_password = hash_pass(password)
    database_handler.save_user_to_database(username, email, hashed_password)


def parse_data_from_url(url):
    data = requests.get(url).json()
    next_page = data['next']
    previous_page = data['previous']
    data = data['results']
    complete_data_on_planets = []
    for each_dict in data:
        planet_id = make_planet_id(each_dict['url'])
        collected_data = [planet_id, each_dict['name']] # make the name of the planet as first entry
        if each_dict['diameter'] != 'unknown':
            collected_data.append(float(each_dict['diameter']) / 1000)
        else:
            collected_data.append(each_dict['diameter'])
        collected_data.append(each_dict['climate'])
        collected_data.append(each_dict['terrain'])
        collected_data.append(each_dict['surface_water'])
        if each_dict['population'] != 'unknown':
            collected_data.append(
                float(each_dict['population']) / 1000_000)
        else:
            collected_data.append(each_dict['population'])

        string_of_urls = ','.join(each_dict['residents'])
        collected_data.append([string_of_urls, len(each_dict['residents'])])
        complete_data_on_planets.append(collected_data)
    return complete_data_on_planets, next_page, previous_page


def make_planet_id(url):
    """
    this function takes a planets url, splits it by the / and gets the
    second last element as it is the planet id
    :param url:
    :return:
    """
    return url.split('/')[-2]


def hash_pass(password):
    """
    this function encodes a string and hashes it.
    :param password: plain text password to be hashed
    :return: hashed password in bytes
    """
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())


def check_hashed_password(password, hashed_password):
    """
    this function compares password provided with a hashed password to see
    if it is the same password
    :param password: plain text password
    :param hashed_password: password decoded
    :return: True or False depending on whether the passwords are the same
    """
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)


def save_votes_to_database(planet_id, planet_name, username):
    user_id = database_handler.get_user_id(username)
    database_handler.write_vote_data_to_database(planet_id, planet_name, user_id)


def get_voting_stats():
    return database_handler.get_vote_statistics()


# def main():
#     print(handle_login({'username': 'jan'}))
#
#
# if __name__ == '__main__':
#     main()