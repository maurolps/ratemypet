
# Feature: UC-001 CreateUser Architecture

```mermaid
flowchart RL
   
classDef main fill:#F8BBD0, color:#000000, stroke:#999999, stroke-width:1.5px;
classDef presentation fill:#C5E1A5, color:#000000, stroke:#999999, stroke-width:1.5px;
classDef application fill:#B3E5FC, color:#000000, stroke:#999999, stroke-width:1.5px;
classDef domain fill:#FFF9C4, color:#000000, stroke:#999999, stroke-width:1.5px;
classDef infra fill:#E1BEE7, color:#000000, stroke:#999999, stroke-width:1.5px;
classDef interface color:#000000, stroke:#fff, stroke-dasharray: 13 5, stroke-width:2px;

  subgraph UC-001 CreateUser Architecture
  
    subgraph Presentation
      Controller-->RequestDTO:::interface
      Controller-->ResponseDTO:::interface
      Controller-->ControllerModel:::interface
    end
    subgraph Infra
      Adapter
      RepositoryAdapter
    end
    subgraph Application
      UseCase-->Port:::interface 
      UseCase-->Repository:::interface
            Adapter-.->Port
      RepositoryAdapter-.->Repository
    end

    subgraph Domain
      Controller-.->CreateUser
      UseCase-..->CreateUser
      CreateUser:::interface --> User
    end

    class App,SignUpRouter,ExpressRouteAdapter,CompositionRoot main;
    class Controller,RequestDTO,ResponseDTO,ControllerModel presentation;
    class UseCase,Repository,Port application;
    class CreateUser,User domain;
    class Adapter,RepositoryAdapter,JwtAdapter infra;
   
end
```