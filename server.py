import requests
import json

from flask import Flask, render_template


app = Flask(__name__)


@app.route('/')
def index():
    results = []

    url = f"https://swapi.co/api/planets/?page=1"
    data = requests.get(url).json()

    next_page = data['next']
    data = data['results']
    
    for each_dict in data:
        collected_data = []
        collected_data.append(each_dict['name'])
        if each_dict['diameter'] != 'unknown':
            collected_data.append(float(each_dict['diameter'])/1000)
        else:
            collected_data.append(each_dict['diameter'])
        collected_data.append(each_dict['climate'])
        collected_data.append(each_dict['terrain'])
        collected_data.append(each_dict['surface_water'])
        if each_dict['population'] != 'unknown':
            collected_data.append(
                float(each_dict['population'])/1000_000)
        else:
            collected_data.append(each_dict['population'])
        
        string_of_urls = ','.join(each_dict['residents'])
        collected_data.append([string_of_urls, len(each_dict['residents'])])
        results.append(collected_data)
    
    return render_template('index.html', results=results, next_page=next_page)


if __name__ == '__main__':
    app.run(debug=True)
