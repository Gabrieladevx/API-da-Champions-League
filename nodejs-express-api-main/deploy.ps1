# PowerShell Deploy script for Podcast Manager API to Azure
# Requires Azure CLI to be installed and logged in

param(
    [string]$ResourceGroup = "rg-podcast-manager-api",
    [string]$Location = "brazilsouth",
    [string]$AppName = "podcast-manager-api-$(Get-Date -Format 'yyyyMMddHHmmss')",
    [string]$Sku = "B1"
)

Write-Host "=== Azure Deployment Script for Podcast Manager API ===" -ForegroundColor Green
Write-Host "Resource Group: $ResourceGroup"
Write-Host "Location: $Location"
Write-Host "App Name: $AppName"
Write-Host "SKU: $Sku"
Write-Host ""

# Check if Azure CLI is installed
try {
    az --version | Out-Null
    Write-Host "✅ Azure CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
}

# Check if user is logged in
try {
    az account show | Out-Null
    Write-Host "✅ You are logged in to Azure" -ForegroundColor Green
} catch {
    Write-Host "❌ You are not logged in to Azure. Please run:" -ForegroundColor Red
    Write-Host "   az login"
    exit 1
}

Write-Host ""

# Step 1: Create Resource Group
Write-Host "📦 Creating resource group..." -ForegroundColor Blue
az group create --name $ResourceGroup --location $Location --output table

Write-Host ""

# Step 2: Deploy infrastructure using Bicep
Write-Host "🏗️  Deploying infrastructure with Bicep..." -ForegroundColor Blue
Write-Host "   Running what-if analysis first..."

az deployment group what-if `
    --resource-group $ResourceGroup `
    --template-file "infra/main.bicep" `
    --parameters appName=$AppName location=$Location appServiceSku=$Sku

Write-Host ""
$proceed = Read-Host "Do you want to proceed with the deployment? (y/N)"

if ($proceed -ne "y" -and $proceed -ne "Y") {
    Write-Host "❌ Deployment cancelled by user" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Deploying infrastructure..." -ForegroundColor Blue
$deploymentOutput = az deployment group create `
    --resource-group $ResourceGroup `
    --template-file "infra/main.bicep" `
    --parameters appName=$AppName location=$Location appServiceSku=$Sku `
    --output json | ConvertFrom-Json

# Extract web app name from deployment output
$WebAppName = $deploymentOutput.properties.outputs.webAppName.value

Write-Host "✅ Infrastructure deployed successfully!" -ForegroundColor Green
Write-Host "   Web App Name: $WebAppName"
Write-Host ""

# Step 3: Build the application
Write-Host "🔨 Building application..." -ForegroundColor Blue
npm install
npm run build

Write-Host "✅ Application built successfully!" -ForegroundColor Green
Write-Host ""

# Step 4: Deploy application to Azure App Service
Write-Host "📤 Deploying application to Azure App Service..." -ForegroundColor Blue

# Create a ZIP file for deployment
$DeployZip = "podcast-manager-deploy.zip"
Compress-Archive -Path . -DestinationPath $DeployZip -Force -Exclude @("node_modules", ".git", "*.zip", ".env*", "*.log")

# Deploy using Azure CLI
az webapp deployment source config-zip `
    --resource-group $ResourceGroup `
    --name $WebAppName `
    --src $DeployZip

# Clean up
Remove-Item $DeployZip

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Deployment Summary:" -ForegroundColor Yellow
Write-Host "   Resource Group: $ResourceGroup"
Write-Host "   Web App Name: $WebAppName"
Write-Host "   URL: https://$WebAppName.azurewebsites.net"
Write-Host ""
Write-Host "🔗 Useful commands:" -ForegroundColor Yellow
Write-Host "   View logs: az webapp log tail --resource-group $ResourceGroup --name $WebAppName"
Write-Host "   Browse app: az webapp browse --resource-group $ResourceGroup --name $WebAppName"
Write-Host "   Delete resources: az group delete --name $ResourceGroup --yes --no-wait"
Write-Host ""
Write-Host "✅ API Endpoints available at:" -ForegroundColor Green
Write-Host "   GET https://$WebAppName.azurewebsites.net/api/list"
Write-Host "   GET https://$WebAppName.azurewebsites.net/api/podcasts?p=flow"
Write-Host "   GET https://$WebAppName.azurewebsites.net/health"