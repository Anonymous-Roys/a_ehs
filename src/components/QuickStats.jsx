import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { AlertTriangle, BarChart3, TrendingUp, Zap } from 'lucide-react'

const QuickStats = () => {
  return (
    <Card className="col-span-1 md:col-span-1 energy-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Power</p>
                    <p className="text-xl font-medium">3.8 kW</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Usage</p>
                    <p className="text-xl font-medium">28.6 kWh</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solar Generation</p>
                    <p className="text-xl font-medium">18.4 kWh</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alerts</p>
                    <p className="text-xl font-medium">None</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
  )
}

export default QuickStats