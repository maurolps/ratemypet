
# Feature: UC-001 CreateUser Architecture

```mermaid
---
config:
  layout: elk
---

flowchart RL

  subgraph Architecture[UC-001 CreateUser Architecture]
  
    %% Presentation
    subgraph Presentation
      CreateUserController --> RequestDTO
      CreateUserController --> ResponseDTO
      CreateUserController --> HttpValidator
      CreateUserController --> ErrorPresenter
    end

    %% Infra
    subgraph Infra
      Adapter
      RepositoryAdapter
    end

    %% Application
    subgraph Application
      UseCase --> Port
      UseCase --> Repository
      Adapter -.-> Port
      RepositoryAdapter -.-> Repository
    end

    %% Domain
    subgraph Domain
      CreateUserController -.-> CreateUser
      UseCase -..-> CreateUser
      CreateUser --> User
    end

  end

  %% Panels Styling
  style Presentation fill:#F5FBFF,stroke:#CFEAFF,stroke-width:2px
  style Application  fill:#F7FFF4,stroke:#D5F1C9,stroke-width:2px
  style Domain       fill:#FFFAF2,stroke:#FFE2BC,stroke-width:2px
  style Infra        fill:#FBF6FF,stroke:#E4D7FF,stroke-width:2px
  style Architecture fill:#fafafa,stroke:#e3e3e3,stroke-width:0.5px

  %% Classes
  classDef presentation fill:#FAFDFF,stroke:#DCEEFF,stroke-width:1.5px,color:#184C7E;
  classDef application  fill:#FAFFFA,stroke:#E0F6D7,stroke-width:1.5px,color:#1E5F28;
  classDef domain       fill:#FFFDF8,stroke:#FFEAD1,stroke-width:1.5px,color:#6C4A15;
  classDef infra        fill:#FDFBFF,stroke:#EEE6FF,stroke-width:1.5px,color:#4B2E83;

  %% Apply Classes
  class CreateUserController,RequestDTO,ResponseDTO,HttpValidator,ErrorPresenter presentation;
  class Adapter,RepositoryAdapter infra;
  class UseCase,Port,Repository application;
  class CreateUser,User domain;

```