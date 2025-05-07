# Evaluator Class
A javascript class that spins up docker containers to evaluate code

# Public methods
- ## Initiate Session
    Spin up docker container for an individual user
    ### Possible Parameters
    - user_id: The id of the user to spin up a container for
    - language: The programming language to use for the container
    - timeout: Maximum time for a container to be open
    ### Possible response
    - send success or failure message back to the client
    - send ubuntu start page if successful

- ## Send command (if we can stream the full console, this may not be necessary)
    Send a terminal command to be executed within the container.

    ### Possible Parameters
    - command: The command to execute within the container

    ### Response
    - Console output of command

- ## Send Code
    Send code to be executed within the container. In the initial stages, this could be conceptualized as a single string, but eventually we will be dealing with full filesystems, so may want something closer to a temporary github repository containing the code. It is important that we do not use the github repository belonging to the user, since we want them to be able to run code and debug without committing.

    ### Possible Parameters
    - github_repo: A temporary github repository containing the code
    
    ### Response
    - Console output of code run. Best case would be to show the commands used to run the code in the client's console, giving experience into using github and linux systems. eg. `git clone https://github.com/user/repo.git && cd repo && python3 main.py`

- ## Restart
    Since the user will have full access to the docker container, there is a definite chance they will break it at some point. There needs to be an option to restart the container while keeping any written code in the browser.

    From a backend perspective, this can use the params from the container being closed, so we do not need any new parameters. After deletion we run the initialize command.

# Implementation Considerations
- Code should be used efficiently, and not stored server-side until runtime. Package installs will have to be kept, unless we use a set of pre-installed packages that can be loaded in at runtime.



