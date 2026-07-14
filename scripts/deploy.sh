#!/bin/bash
# Nexlynk Deploy Script
# Usage: ./scripts/deploy.sh [web|admin|api|all]

set -e

echo "🚀 Nexlynk Deploy Script"
echo "========================"

case "$1" in
  web)
    echo "📦 Building web app..."
    cd apps/web
    npm install
    npm run build
    echo "✅ Web app built successfully!"
    echo "📁 Output: apps/web/dist"
    ;;
  
  admin)
    echo "📦 Building admin app..."
    cd apps/admin
    npm install
    npm run build
    echo "✅ Admin app built successfully!"
    echo "📁 Output: apps/admin/dist"
    ;;
  
  api)
    echo "📦 Building API..."
    cd apps/api
    npm install
    npm run build
    echo "✅ API built successfully!"
    echo "📁 Output: apps/api/dist"
    ;;
  
  all)
    echo "📦 Building all apps..."
    
    echo ""
    echo "1/3 Building shared library..."
    npm install
    
    echo ""
    echo "2/3 Building web app..."
    cd apps/web
    npm install
    npm run build
    cd ../..
    
    echo ""
    echo "3/3 Building admin app..."
    cd apps/admin
    npm install
    npm run build
    cd ../..
    
    echo ""
    echo "✅ All apps built successfully!"
    ;;
  
  *)
    echo "Usage: ./scripts/deploy.sh [web|admin|api|all]"
    echo ""
    echo "Examples:"
    echo "  ./scripts/deploy.sh web    # Build web app only"
    echo "  ./scripts/deploy.sh admin  # Build admin app only"
    echo "  ./scripts/deploy.sh api    # Build API only"
    echo "  ./scripts/deploy.sh all    # Build all apps"
    exit 1
    ;;
esac

echo ""
echo "✨ Done!"
