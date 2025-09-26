# 🚀 Resumo do Deploy Azure - API da Champions League (Podcast Manager)

## ✅ Status: Pronto para Deploy

Sua API Podcast Manager está **completamente configurada** para deploy na nuvem Azure! 

## 🎯 O que foi implementado

### 📦 Infraestrutura Azure (Bicep)
- **App Service Plan Linux** com Node.js 18 LTS
- **Web App** com configurações otimizadas
- **Application Insights** para monitoramento
- **Log Analytics** para logs centralizados
- **Variáveis de ambiente** configuradas automaticamente

### 🤖 Automação CI/CD
- **GitHub Actions** para deploy automático
- **Scripts de deploy manual** (Bash e PowerShell)
- **Testes automatizados** dos endpoints
- **Health check** integrado

### 🔍 Monitoramento
- Endpoint `/health` para verificação de status
- Integração com Application Insights
- Logs estruturados no Azure

## 🚀 Como fazer o deploy

### Opção 1: Deploy Automático (RECOMENDADO)

1. **Configure o GitHub Secret**:
   - No Azure Portal, vá para o App Service que será criado
   - Clique em "Get publish profile" e baixe o arquivo
   - No GitHub, vá em Settings > Secrets > Actions
   - Crie um secret chamado `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Cole o conteúdo do arquivo de publish profile

2. **Faça push para main**:
   ```bash
   git push origin main
   ```
   
   O deploy será executado automaticamente!

### Opção 2: Deploy Manual

#### Linux/macOS:
```bash
cd nodejs-express-api-main
./deploy.sh
```

#### Windows (PowerShell):
```powershell
cd nodejs-express-api-main
./deploy.ps1
```

### Opção 3: Deploy Passo a Passo

```bash
# 1. Login no Azure
az login

# 2. Criar Resource Group
az group create --name rg-podcast-manager-api --location brazilsouth

# 3. Deploy da infraestrutura
cd nodejs-express-api-main
az deployment group create \
  --resource-group rg-podcast-manager-api \
  --template-file infra/main.bicep \
  --parameters appName=podcast-manager-api-$(date +%s) location=brazilsouth

# 4. Build e deploy da aplicação
npm install && npm run build
zip -r deploy.zip . -x "node_modules/*" ".git/*"
az webapp deployment source config-zip \
  --resource-group rg-podcast-manager-api \
  --name [WEB_APP_NAME] \
  --src deploy.zip
```

## 🔗 Endpoints da API

Após o deploy, sua API estará disponível em:

- **Health Check**: `GET https://[app-name].azurewebsites.net/health`
- **Listar Podcasts**: `GET https://[app-name].azurewebsites.net/api/list`
- **Filtrar Podcasts**: `GET https://[app-name].azurewebsites.net/api/podcasts?p=flow`

## 📊 Monitoramento

### Application Insights
- Métricas de performance
- Rastreamento de erros
- Monitoramento de dependências

### Logs
```bash
# Ver logs em tempo real
az webapp log tail --resource-group rg-podcast-manager-api --name [WEB_APP_NAME]
```

## 🧹 Limpeza de Recursos

Para deletar todos os recursos criados:
```bash
az group delete --name rg-podcast-manager-api --yes --no-wait
```

## 📚 Documentação Completa

- **`AZURE_DEPLOYMENT.md`**: Guia detalhado de deploy
- **`deploy.sh`**: Script de deploy para Linux/macOS
- **`deploy.ps1`**: Script de deploy para Windows
- **`.github/workflows/azure-deploy.yml`**: Pipeline CI/CD

## 🎉 Pronto para Produção!

Sua API está configurada com:
- ✅ Build automático
- ✅ Deploy automático
- ✅ Monitoramento
- ✅ Health checks
- ✅ Logs estruturados
- ✅ Infraestrutura como código
- ✅ Scripts multi-plataforma

**Escolha uma das opções de deploy acima e sua API estará no ar em poucos minutos!** 🚀