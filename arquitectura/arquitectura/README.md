# Arquitectura — Agente IA para Consultas en Lenguaje Natural

## Diagrama de Componentes

```mermaid
graph TB
    subgraph Clientes
        UI_INT["Interno (Colaborador)"]
        UI_EXT["Externo (Aliado)"]
    end
    subgraph Gateway["API Gateway + Auth"]
        GW["AWS API Gateway"]
        AUTH["Auth Service — JWT + OAuth2\nRoles: INTERNAL / EXTERNAL"]
    end
    subgraph IA["Orquestación IA"]
        AGENT["AI Agent — LangChain / LangGraph"]
        HIST["Historial 24h — Redis TTL=86400s"]
        ROUTER["Query Router"]
    end
    subgraph Datos["Fuentes de Datos"]
        DW["Data Warehouse — Snowflake/BigQuery"]
        API_INT["APIs Internas"]
        RBAC["RBAC / Row-Level Security"]
    end
    LLM["LLM — GPT-4o"]

    UI_INT -->|HTTPS + JWT| GW
    UI_EXT -->|HTTPS + JWT| GW
    GW --> AUTH
    AUTH --> AGENT
    AGENT --> HIST
    AGENT --> ROUTER
    ROUTER --> DW
    ROUTER --> API_INT
    DW --> RBAC
    API_INT --> RBAC
    RBAC --> AGENT
    AGENT <--> LLM
    AGENT --> GW
```

## Diagrama de Secuencia

```mermaid
sequenceDiagram
    actor U as Usuario
    participant GW as API Gateway
    participant A as Auth
    participant AG as AI Agent
    participant R as Redis
    participant DW as Data Warehouse
    participant LLM as GPT-4o

    U->>GW: POST /query "¿Ventas de ayer por aliado?"
    GW->>A: Validar JWT
    A-->>GW: {userId, role, allowedDomains}
    GW->>AG: query + contexto
    AG->>R: GET historial 24h
    R-->>AG: conversaciones previas
    AG->>LLM: prompt = historial + query + schema
    LLM-->>AG: SQL generado
    AG->>DW: Ejecutar SQL con RLS
    DW-->>AG: datos filtrados por tenant
    AG->>LLM: datos + "genera respuesta con cita"
    LLM-->>AG: respuesta + [fuente: tabla, timestamp]
    AG->>R: Guardar en historial (TTL 24h)
    AG-->>GW: {answer, sources}
    GW-->>U: respuesta con trazabilidad
```

## Tecnologías y Componentes

| Componente | Tecnología | Razón |
|---|---|---|
| Orquestación IA | LangChain / LangGraph | Agentes con memoria, tool-calling y trazabilidad |
| LLM | GPT-4o / modelo privado | Balance costo/calidad |
| Historial | Redis TTL=86400s | Expiración automática 24h, baja latencia |
| Data Warehouse | Snowflake / BigQuery | Row-Level Security nativo, escalable |
| Auth | JWT + OAuth2 | Roles granulares INTERNAL / EXTERNAL |
| Gateway | AWS API Gateway | Rate limiting, WAF, logging centralizado |

## Decisiones de Seguridad

- **Aislamiento de tenants**: Row-Level Security en BD + `tenant_id` obligatorio en cada query
- **Roles**: JWT con claims `role: INTERNAL | EXTERNAL` y `allowedDomains[]`
- **Prompt injection**: sanitización del input antes de enviarlo al LLM
- **Auditoría**: log de cada consulta con `userId`, `timestamp`, `sources_used`
- **Secretos**: AWS Secrets Manager / HashiCorp Vault

## Estrategia de Escalado

- Agente IA stateless → escala horizontal con Kubernetes HPA
- Redis Cluster para alta disponibilidad del historial
- Respuesta en streaming (SSE) para reducir latencia percibida
- Cola SQS para peticiones asíncronas en picos de carga

## Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Prompt injection | Alto | Sanitización + restricción de tool-calling |
| Fuga entre tenants | Crítico | RLS + tests de aislamiento en CI/CD |
| Alucinaciones del LLM | Medio | Respuestas siempre con cita de fuente |
| Costo descontrolado | Medio | Rate limiting + alertas de presupuesto |
| Latencia alta | Medio | Streaming SSE + timeout con fallback |