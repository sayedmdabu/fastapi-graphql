import pytest
from orator import DatabaseManager, Model, Schema
from orator.migrations import DatabaseMigrationRepository, Migrator


@pytest.fixture(autouse=True)
def setup_database():
    DATABASES = {
        "sqlite": {
            "driver": "sqlite",
            "database": "test.db"
        }
    }

    db = DatabaseManager(DATABASES)
    Schema(db)

    Model.set_connection_resolver(db)

    repository = DatabaseMigrationRepository(db, "migrations")
    migrator = Migrator(repository, db)

    if not repository.repository_exists():
        repository.create_repository()

    migrator.reset("migrations")
    migrator.run("migrations")