#!/bin/bash

# Deploy script for Podcast Manager API to Azure
# Requires Azure CLI to be installed and logged in

set -e  # Exit immediately if a command exits with a non-zero status

# Configuration
RESOURCE_GROUP="rg-podcast-manager-api"
LOCATION="brazilsouth"
APP_NAME="podcast-manager-api-$(date +%s)"  # Add timestamp for uniqueness
SKU="B1"

echo "=== Azure Deployment Script for Podcast Manager API ==="
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"
echo "App Name: $APP_NAME"
echo "SKU: $SKU"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if user is logged in
if ! az account show &> /dev/null; then
    echo "❌ You are not logged in to Azure. Please run:"
    echo "   az login"
    exit 1
fi

echo "✅ Azure CLI is installed and you are logged in"
echo ""

# Step 1: Create Resource Group
echo "📦 Creating resource group..."
az group create \
    --name "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --output table

echo ""

# Step 2: Deploy infrastructure using Bicep
echo "🏗️  Deploying infrastructure with Bicep..."
echo "   Running what-if analysis first..."

az deployment group what-if \
    --resource-group "$RESOURCE_GROUP" \
    --template-file "infra/main.bicep" \
    --parameters appName="$APP_NAME" location="$LOCATION" appServiceSku="$SKU"

echo ""
read -p "Do you want to proceed with the deployment? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled by user"
    exit 1
fi

echo "🚀 Deploying infrastructure..."
DEPLOYMENT_OUTPUT=$(az deployment group create \
    --resource-group "$RESOURCE_GROUP" \
    --template-file "infra/main.bicep" \
    --parameters appName="$APP_NAME" location="$LOCATION" appServiceSku="$SKU" \
    --output json)

# Extract web app name from deployment output
WEB_APP_NAME=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.properties.outputs.webAppName.value')

echo "✅ Infrastructure deployed successfully!"
echo "   Web App Name: $WEB_APP_NAME"
echo ""

# Step 3: Build the application
echo "🔨 Building application..."
npm install
npm run build

echo "✅ Application built successfully!"
echo ""

# Step 4: Deploy application to Azure App Service
echo "📤 Deploying application to Azure App Service..."

# Create a ZIP file for deployment
DEPLOY_ZIP="podcast-manager-deploy.zip"
zip -r "$DEPLOY_ZIP" . \
    -x "node_modules/*" \
    -x ".git/*" \
    -x "*.zip" \
    -x ".env*" \
    -x "*.log"

# Deploy using Azure CLI
az webapp deployment source config-zip \
    --resource-group "$RESOURCE_GROUP" \
    --name "$WEB_APP_NAME" \
    --src "$DEPLOY_ZIP"

# Clean up
rm "$DEPLOY_ZIP"

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Web App Name: $WEB_APP_NAME"
echo "   URL: https://$WEB_APP_NAME.azurewebsites.net"
echo ""
echo "🔗 Useful commands:"
echo "   View logs: az webapp log tail --resource-group $RESOURCE_GROUP --name $WEB_APP_NAME"
echo "   Browse app: az webapp browse --resource-group $RESOURCE_GROUP --name $WEB_APP_NAME"
echo "   Delete resources: az group delete --name $RESOURCE_GROUP --yes --no-wait"
echo ""
echo "✅ API Endpoints available at:"
echo "   GET https://$WEB_APP_NAME.azurewebsites.net/api/list"
echo "   GET https://$WEB_APP_NAME.azurewebsites.net/api/podcasts?p=flow"