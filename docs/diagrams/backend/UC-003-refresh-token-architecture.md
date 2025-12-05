
# Feature: UC-003 RefreshToken Architecture

> Mermaid code available below.
> You can copy the code and render it with [Mermaid Live Editor](https://mermaid.live/).  

<img alt="UC003 Architecture Diagram" src="https://raw.githubusercontent.com/maurolps/ratemypet/refs/heads/main/docs/assets/uc003-diagram.png" width="650" />

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

  subgraph Architecture[UC-003 RefreshToken Architecture Overview]

    %% Domain
    subgraph Domain
      UseCaseContract(["UseCase<br><small>_Contract_</small>"]) --- Token
    end

    %% Infra
    subgraph Infra
      Adapters[BcryptAdapter]
      PgUserRepositoryAdapter
      PgRefreshTokenRepositoryAdapter
      JwtAdapter
      CryptoAdapter
    end

    %% Application
    subgraph Application
      subgraph Core
      UseCase[RefreshTokenUseCase]
        subgraph Service[TokenIssuer]
          Method1["<small>_validate_</small>"]
          Method2["<small>_Execute_</small>"]
          Method3["<small>_Revoke_</small>"]
          Method1 --> Method2 --> Method3
        end
      end
      subgraph Repositories
      Repository(["FindUserRepository<br><small>_Contract_</small>"])
      Repository2(["RefreshTokenRepository<br><small>_Contract_</small>"])
      end
      subgraph Ports
       Hasher
       TokenGenerator
      end

    end
          %% Application Relations
          UseCase -.-> UseCaseContract
          UseCase -.-> Hasher
          UseCase -.-> Service -.-> Repository
          Service -.-> TokenGenerator
          Service -.-> Hasher
          Service -.-> Repository2
          JwtAdapter -.-> TokenGenerator
          CryptoAdapter -.-> TokenGenerator
          Adapters -.-> Hasher
          PgUserRepositoryAdapter -.-> Repository
          PgRefreshTokenRepositoryAdapter -.-> Repository2

  end
  

  %% Panels Styling
  style Application  fill:#F7FFF4,stroke:#D5F1C9,stroke-width:2px
  style Domain       fill:#FFFAF2,stroke:#FFE2BC,stroke-width:2px
  style Infra        fill:#FBF6FF,stroke:#E4D7FF,stroke-width:2px
  style Architecture fill:#fafafa,stroke:#e3e3e3,stroke-width:0.5px

  %% Classes
  classDef application  fill:#FAFFFA,stroke:#E0F6D7,stroke-width:1.5px,color:#1E5F28;
  classDef domain       fill:#FFFDF8,stroke:#FFEAD1,stroke-width:1.5px,color:#6C4A15;
  classDef infra        fill:#FDFBFF,stroke:#EEE6FF,stroke-width:1.5px,color:#4B2E83;

  %% Apply Classes
  class Adapters,PgUserRepositoryAdapter,PgRefreshTokenRepositoryAdapter,CryptoAdapter,JwtAdapter,Node,JWT infra;
  class Method1,Method2,Method3,UseCase,Repositories,Ports,Repository,Repository2,Core,Service,Hasher,TokenGenerator application;
  class UseCaseContract,Token domain;
```
</details>