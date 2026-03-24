# How to Connect with TablePlus

To connect to your Dockerized PostgreSQL database using TablePlus:

1.  Open TablePlus and create a new connection.
2.  Select **PostgreSQL**.
3.  Enter the following details:
    - **Name**: `Gearboard` (or any name you like)
    - **Host**: `localhost` (or `127.0.0.1`)
    - **Port**: `5432`
    - **User**: `<YOUR_DB_USER>` (see .env)
    - **Password**: `<YOUR_DB_PASSWORD>` (see .env)
    - **Database**: `<YOUR_DB_NAME>` (see .env)
    - **SSL**: `Prefer` or `Disable`
4.  Click **Test** to verify, then **Connect**.

> **Note**: If you cannot connect, ensure the container is running with `docker ps` and that port `5432` is not blocked or used by another service.
