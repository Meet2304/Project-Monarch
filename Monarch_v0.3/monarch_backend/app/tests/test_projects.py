from fastapi.testclient import TestClient
from sqlmodel import Session
from app.models.project import Project

def test_create_project(client: TestClient):
    #1. Defining the data to send
    payload = {
        "name": "Test Project",
        "description": "This is a test project"
    }

    #2. Making the POST request to create a new project
    response = client.post("/projects/", json=payload)

    #3. Assert that the request was successful
    data = response.json()
    assert response.status_code == 200
    assert data["name"] == payload["name"]
    assert data["description"] == payload["description"]
    assert "id" in data # Ensures that the DB generated an ID for the new project

def test_read_projects(client: TestClient):
    #1. Creating a projec to ensure that there is at least one project in the database
    payload = {
        "name": "Test Project",
        "description": "This is a test project"
    }

    #2. Send a POST request to create a new project
    client.post("/projects/", json=payload)

    #3. Get the list of projects
    response = client.get("/projects/")
    data = response.json()

    #3. Verify that we got a list back
    assert response.status_code == 200
    assert len(data) > 0
    assert data[0]["name"] == payload["name"]
    assert data[0]["description"] == payload["description"]

def test_update_project(client: TestClient):
    #1. Create a project to update
    payload = {
        "name": "Test Project",
        "description": "This is a test project"
    }

    #2. Create the project
    response = client.post("/projects/", json=payload)
    data = response.json()
    project_id = data["id"]

    #3. Update only the name
    update_payload = {
        "name": "Updated Project Name"
    }
    response = client.patch(f"/projects/{project_id}", json=update_payload)
    updated_data = response.json()

    #4. Verify the name change
    assert response.status_code == 200
    assert updated_data["name"] == "Updated Project Name"
    assert updated_data["description"] == payload["description"]  # Description should remain unchanged
    assert updated_data["id"] == project_id  # ID should remain unchanged

def test_delete_project(client: TestClient):
     #1. Create a project to update
    payload = {
        "name": "Test Project",
        "description": "This is a test project"
    }
    #2. Create the project
    response = client.post("/projects/", json=payload)
    data = response.json()
    project_id = data["id"]

    #3. Delete the project
    response = client.delete(f"/projects/{project_id}")
    assert response.status_code == 200
    assert response.json() == {"ok": True}

    #4. Verify that the project no longer exists
    response = client.get(f"/projects/{project_id}")
    assert response.status_code == 404
