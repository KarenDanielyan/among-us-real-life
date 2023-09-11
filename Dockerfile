FROM postgres:15

COPY db_setup.sql /docker-entrypoint-initdb.d/
#deleteme
