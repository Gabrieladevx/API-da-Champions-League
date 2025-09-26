@description('Nome base da aplicação (usa-se para nomear recursos)')
param appName string

@description('Região de implantação')
@allowed([
  'brazilsouth'
  'brazilse'
  'eastus'
  'eastus2'
  'westus3'
  'westeurope'
])
param location string

@description('SKU do App Service Plan')
@allowed([
  'B1'
  'P0v3'
  'P1v3'
])
param appServiceSku string = 'B1'

// Workspace de Log Analytics
resource law 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${appName}-law'
  location: location
  sku: {
    name: 'PerGB2018'
  }
  properties: {
    retentionInDays: 30
  }
}

// Application Insights (Coletor)
resource appi 'Microsoft.Insights/components@2020-02-02' = {
  name: '${appName}-appi'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: law.id
  }
}

// App Service Plan Linux
resource asp 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: '${appName}-plan'
  location: location
  sku: {
    name: appServiceSku
    tier: (appServiceSku == 'B1') ? 'Basic' : 'PremiumV3'
  }
  kind: 'linux'
  properties: {
    reserved: true // Linux
  }
}

// Web App Linux
resource app 'Microsoft.Web/sites@2022-09-01' = {
  name: '${appName}-web'
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: asp.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'WEBSITES_PORT'
          value: '8080'
        }
        {
          name: 'PORT'
          value: '8080'
        }
        {
          name: 'HOST'
          value: '0.0.0.0'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: '1'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appi.properties.InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appi.properties.ConnectionString
        }
      ]
    }
  }
}

output webAppName string = app.name
output appInsightsName string = appi.name
output logAnalyticsName string = law.name
