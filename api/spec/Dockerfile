FROM python:3.6

COPY . /spec
WORKDIR /spec/test

RUN pip install -r requirements.txt

CMD python test-schema.py