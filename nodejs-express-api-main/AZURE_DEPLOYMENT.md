# Guia de Deploy para Azure

Este documento detalha como fazer o deploy da API Podcast Manager para a nuvem Azure.

## 📋 Pré-requisitos

- Conta Azure ativa
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) instalado
- Node.js 18+ instalado
- Git configurado

## 🏗️ Arquitetura Azure

A aplicação utiliza os seguintes recursos Azure:

- **App Service Plan (Linux)**: Hospedagem da aplicação Node.js
- **Web App**: Aplicação principal rodando Node.js 18 LTS
- **Application Insights**: Monitoramento e telemetria
- **Log Analytics Workspace**: Centralização de logs

## 🚀 Opções de Deploy

### Opção 1: Deploy Automático (Recomendado)

Utilizando GitHub Actions para CI/CD automático:

1. **Configure os Secrets do GitHub**:
   ```bash
   # No Azure, baixe o perfil de publicação do App Service
   # Vá para: App Service > Overview > Get publish profile
   ```
   
   Adicione no GitHub (Settings > Secrets):
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: Conteúdo do arquivo .publishSettings

2. **Faça push para main**:
   ```bash
   git push origin main
   ```
   
   O workflow será executado automaticamente.

### Opção 2: Deploy Manual

Execute o script de deploy automático:

```bash
# Faça login no Azure
az login

# Execute o script de deploy
./deploy.sh
```

### Opção 3: Deploy Passo a Passo

#### 1. Login no Azure
```bash
az login
```

#### 2. Definir variáveis
```bash
RESOURCE_GROUP="rg-podcast-manager-api"
LOCATION="brazilsouth"
APP_NAME="podcast-manager-api-$(date +%s)"
```

#### 3. Criar Resource Group
```bash
az group create --name $RESOURCE_GROUP --location $LOCATION
```

#### 4. Deploy da infraestrutura
```bash
# Visualizar mudanças
az deployment group what-if \
  --resource-group $RESOURCE_GROUP \
  --template-file infra/main.bicep \
  --parameters appName=$APP_NAME location=$LOCATION

# Executar deploy
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file infra/main.bicep \
  --parameters appName=$APP_NAME location=$LOCATION
```

#### 5. Build e Deploy da aplicação
```bash
# Build local
npm install
npm run build

# Deploy para App Service
zip -r deploy.zip . -x "node_modules/*" ".git/*"
az webapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME-web \
  --src deploy.zip
```

## 🔧 Configuração de Variáveis de Ambiente

As seguintes variáveis são configuradas automaticamente:

- `PORT=8080`: Porta padrão do App Service
- `HOST=0.0.0.0`: Para aceitar conexões externas
- `APPINSIGHTS_INSTRUMENTATIONKEY`: Chave do Application Insights
- `APPLICATIONINSIGHTS_CONNECTION_STRING`: String de conexão do Application Insights

## 📊 Monitoramento

### Application Insights
- URL: Portal Azure > Application Insights > [nome-da-app]-appi
- Métricas: Requests, Response times, Failures
- Logs: Traces, Exceptions, Custom events

### Log Analytics
- URL: Portal Azure > Log Analytics workspaces > [nome-da-app]-law
- Query logs usando KQL (Kusto Query Language)

## 🔍 Troubleshooting

### Ver logs em tempo real
```bash
az webapp log tail --resource-group $RESOURCE_GROUP --name $APP_NAME-web
```

### Acessar console SSH
```bash
az webapp ssh --resource-group $RESOURCE_GROUP --name $APP_NAME-web
```

### Problemas comuns

1. **App não inicia**: Verifique se `package.json` tem script `start`
2. **Port binding error**: Certifique-se que a app usa `process.env.PORT`
3. **Build failure**: Verifique dependências e script `build`

## 🧪 Testar o Deploy

Após o deploy, teste os endpoints:

```bash
# Listar todos os episódios
curl https://[app-name].azurewebsites.net/api/list

# Filtrar por podcast
curl https://[app-name].azurewebsites.net/api/podcasts?p=flow
```

## 🗑️ Limpeza de Recursos

Para deletar todos os recursos criados:

```bash
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

## 📚 Recursos Adicionais

- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Node.js on Azure](https://docs.microsoft.com/azure/app-service/quickstart-nodejs)
- [Application Insights for Node.js](https://docs.microsoft.com/azure/azure-monitor/app/nodejs)