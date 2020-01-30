import json
import secrets
import helper_functions
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify, make_response


app = Flask(__name__)
secret_id = secrets.token_hex(8)
app.secret_key = secret_id


@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        if len(request.form) == 1:
            user = session['username'] if 'username' in session else None
            url = helper_functions.handle_next_or_previous_page(request.form)
            planets_data, next_url, previous_url = helper_functions.parse_data_from_url(url)
            return render_template('index.html', planets_data=planets_data, next_url=next_url,
                                   previous_url=previous_url, user=user)

        elif len(request.form) == 2:
            database_password = helper_functions.handle_login(request.form)
            # check if that user exists if not the db password will be None
            if database_password:
                password = request.form['password']
                username = request.form['username']
                if helper_functions.check_hashed_password(password, database_password):
                    # if the passwords match add session variable for the user name
                    session['username'] = username
                    return redirect(url_for('index'))
                else:
                    flash('login unsuccessful. please check your username or password')
                    return redirect(url_for('login'))
            else:
                flash('login unsuccessful. please check your username or password')
                return redirect(url_for('login'))

        elif len(request.form) == 3:
            helper_functions.handle_registration(request.form)
            # redirect to login
            return redirect(url_for('login'))
    elif request.method == 'GET':
        if 'username' in session:
            user = session['username']
        else:
            user = None
        url = f"https://swapi.co/api/planets/?page=1"
        planets_data, next_url, previous_url = helper_functions.parse_data_from_url(url)
        return render_template('index.html', planets_data=planets_data, next_url=next_url,
                               previous_url=previous_url, user=user)


@app.route('/register')
def register():
    return render_template('sign_up.html')


@app.route('/login', methods=['POST', 'GET'])
def login():
    return render_template('login.html')


@app.route('/logout')
def logout():
    if 'username' in session:
        session.pop('username', None)
    return redirect(url_for('index'))


@app.route('/vote-data', methods=['POST'])
def get_vote_data():
    if 'username' not in session:
        flash('you must be logged in to vote')
        return redirect(url_for('login'))
    incoming_data = request.get_json() # convert incoming json to a python dictionary
    username = session['username']
    planet_name = incoming_data['planet_name']
    planet_id = incoming_data['planet_id']
    helper_functions.save_votes_to_database(planet_id, planet_name, username)
    return redirect(url_for('index'))


@app.route('/make-voting-stats-available')
def make_voting_stats_available():
    if 'username' in session:
        voting_stats = helper_functions.get_voting_stats()
        for i in range(len(voting_stats)):
            voting_stats[i] = dict(voting_stats[i])
        return f"{json.dumps(helper_functions.get_voting_stats())}"
    else:
        flash('you must be logged in to view voting stats')
        return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
