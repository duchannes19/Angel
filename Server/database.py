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
    
    # Get data and convert it to a csv format without type
    def get_csv(self):
        data = self.get_all()
        csv = ""
        # If type is True, then write 'malicious' to the csv file, otherwise write 'benign'
        for item in data:
            type = "malicious" if item['type'] else "benign"
            csv += f"\n{item['url']},{type}"
        return csv
    
        
    # Delete all data from the database
    def delete_all(self):
        # Get all data from the database
        data = self.get_all()
        # Delete all data from the database by id
        for item in data:
            self.db.deleteById(item['id'])
        return True
    
    def check_url(self, url):
        data = self.get_all()
        for item in data:
            if item['url'] == url:
                return item['type']
        return None