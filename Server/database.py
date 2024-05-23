from pysondb import db

class Database:
    def __init__(self, db_name):
        self.db = db.getDb(db_name)
        
    # Get all data from the database
    def get_all(self):
        return self.db.getAll()
    
    # Write data to the database (url, boolean type)
    def write(self, url, is_malicious):
        self.db.add({
            "url": url,
            "type": is_malicious
        })
    
    # Get data and convert it to a csv format
    def get_csv(self):
        data = self.get_all()
        csv = "url,type\n"
        for item in data:
            csv += f"{item['url']},{item['type']}\n"
        return csv
    
    def check_url(self, url):
        data = self.get_all()
        for item in data:
            if item['url'] == url:
                return item['type']
        return None