import React from 'react'
import PowerSettings from '../../components/battery/PowerSettings'
import { ChevronLeft, RefreshCw, Settings } from 'lucide-react'

const BatterySettings = () => {
  return (
    <div>
        <div 
        
        className="sticky top-0 z-10 transition-all duration-500 py-6 bg-gradient-to-b from-slate-50 to-slate-50/95 dark:from-slate-900 dark:to-slate-900/95 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()} 
                className="mr-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold">PowerHive Settings</h1>
                <p className="text-sm text-muted-foreground">Home Energy Storage System</p>
              </div>
            </div>
            
    
          </div>
        </div>
      </div>
      <div className='px-4 container mx-auto'>

        <PowerSettings/>
      </div>
    </div>
  )
}

export default BatterySettings