import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sun, Cloud, CloudRain, CloudSnow } from "lucide-react";
// import { cn } from "../lib/utils";

// interface ForecastDay {
//   day: string;
//   condition: "sunny" | "cloudy" | "rainy" | "snowy";
//   tempHigh: number;
//   tempLow: number;
//   solarPrediction: number;
// }

const forecast = [
  { day: "Today", condition: "sunny", tempHigh: 28, tempLow: 18, solarPrediction: 95 },
  { day: "Tomorrow", condition: "sunny", tempHigh: 30, tempLow: 19, solarPrediction: 100 },
  { day: "Wed", condition: "cloudy", tempHigh: 25, tempLow: 17, solarPrediction: 60 },
  { day: "Thu", condition: "rainy", tempHigh: 22, tempLow: 16, solarPrediction: 30 },
  { day: "Fri", condition: "cloudy", tempHigh: 24, tempLow: 15, solarPrediction: 55 },
];

const getWeatherIcon = (condition) => {
  switch (condition) {
    case "sunny":
      return <Sun className="h-6 w-6 text-yellow-400" />;
    case "cloudy":
      return <Cloud className="h-6 w-6 text-gray-400" />;
    case "rainy":
      return <CloudRain className="h-6 w-6 text-blue-400" />;
    case "snowy":
      return <CloudSnow className="h-6 w-6 text-blue-200" />;
  }
};

const WeatherForecast = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weather & Solar Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {forecast.map((day) => (
            <div key={day.day} className="flex flex-col items-center">
              <span className="text-sm font-medium">{day.day}</span>
              <div className="my-2">{getWeatherIcon(day.condition)}</div>
              <div className="text-xs flex gap-1">
                <span className="text-white">{day.tempHigh}°</span>
                <span className="text-muted-foreground">{day.tempLow}°</span>
              </div>
              <div className="mt-2 w-full">
                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${day.solarPrediction}%` }}
                  />
                </div>
                <div className="text-xs text-center mt-1">{day.solarPrediction}%</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Percentages indicate predicted solar panel efficiency based on weather conditions
        </p>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;