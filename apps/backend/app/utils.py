import os

from dotenv import find_dotenv, load_dotenv

default_file = ".env"


def load_env():
    env = os.environ.get("ENV", default_file)
    env_file = default_file if env == default_file else f".env.{env.lower()}"
    load_dotenv(find_dotenv(env_file))
