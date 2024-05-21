FROM python:3.11.7

# Set the working directory in the container
WORKDIR /home/angel/app

# Copy the entire project to the container
COPY . .

# Install Dependencies
RUN apt-get update \
 && apt-get upgrade -y \
 && apt-get clean \
 && rm -r /var/lib/apt/lists/* /var/cache/*

# Install the project dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5000 for the Angel API
EXPOSE 5000

CMD ["waitress-serve", "--host", "0.0.0.0", "--port", "5000", "app:app"]