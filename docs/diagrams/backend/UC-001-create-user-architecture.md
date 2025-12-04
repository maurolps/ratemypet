
# Feature: UC-001 CreateUser Architecture

> Mermaid code available below.
> You can copy the code and render it with [Mermaid Live Editor](https://mermaid.live/).

<img alt="UC001 Architecture Diagram" src="https://raw.githubusercontent.com/maurolps/ratemypet/refs/heads/main/docs/assets/uc001-diagram.png" width="650" />

<details>
<summary>Expand Mermaid code</summary>

> Note: Displayed as text due to GitHub's lack of Mermaid ELK layout support.

```text
---
config:
  layout: elk
  elk:
    mergeEdges: false
    nodePlacementStrategy: NETWORK_SIMPLEX
---
flowchart TB

  subgraph Architecture[UC-001 CreateUser Architecture Overview]

    %% Presentation
    subgraph Presentation
      Controller[CreateUserController]
      ErrorPresenter
      HttpValidator[ZodHttpValidator]
      UserSchema:::presentation
    end
          %% Presentation Relations
          Controller -.-> CreateUser
          Controller ---> HttpValidator
          Controller --> ErrorPresenter
          ErrorPresenter --> AppError
          HttpValidator -.- UserSchema

    %% Infra
    subgraph Infra
      Adapters[BcryptAdapter]
      UserRepositoryAdapter
    end
          %% Infra Relations
          Adapters --> Bcrypt
          UserRepositoryAdapter --> DB[("Postgres<br><small>_Singleton_</small>")]

    %% Application
    subgraph Application
      CreateUserUseCase
      Repository(["UserRepository<br><small>_Contract_</small>"])
      Ports(["Hasher<br><small>_Contract_</small>"])
      AppError
      ErrorCode[ERROR_CODE]
    end
          %% Application Relations
          CreateUserUseCase -.-> Ports
          CreateUserUseCase -.-> Repository
          CreateUserUseCase -.-> CreateUser
          Adapters -.-> Ports
          UserRepositoryAdapter -.-> Repository
          AppError --- ErrorCode
          
    %% Domain
    subgraph Domain
      CreateUser(["UseCase<br><small>_Contract_</small>"]) --- User
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
  classDef external     fill:#FBF6FF,stroke:#E4D7FF,stroke-width:2px,color:#4B2E83;
  classDef error        fill:#FFECEC,stroke:#F0AAAA,stroke-width:1px,color:#8C2020;

  %% Apply Classes
  class Controller,RequestDTO,ResponseDTO,HttpValidator,ErrorPresenter presentation;
  class Adapters,RepositoryAdapter,UserRepositoryAdapter infra;
  class CreateUserUseCase,Ports,Repository,ErrorCode application;
  class CreateUser,User domain;
  class Bcrypt,DB external;
  class AppError error;
```
</details>