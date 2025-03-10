
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, BookOpen, ChevronRight, LineChart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About ForexJournalBBNC</h1>
        <p className="text-muted-foreground">Your personal trading journal and performance tracker.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome to ForexJournalBBNC!</CardTitle>
          <CardDescription>
            Your all-in-one solution for tracking and improving your trading performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            ForexJournalBBNC designed by Bukit Beruntung Traders for people  tracking and analyzing your trades simple and enjoyable. 
            By maintaining a detailed journal of your trades, you can identify patterns, learn from 
            both your successes and mistakes, and ultimately improve your trading outcomes.
          </p>
          <p>
            Whether you're a beginner or experienced trader, having a structured approach to journaling 
            your trades is one of the most effective ways to enhance your skills and increase your profitability.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              Trade Journal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Record all your trades with detailed information including entry/exit prices, 
              dates, setups, and notes to build a comprehensive trading history.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/trades" className="flex justify-between items-center">
                View Journal <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Visualize your trading results with detailed charts and statistics to identify 
              strengths, weaknesses, and opportunities for improvement.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/analysis" className="flex justify-between items-center">
                View Analysis <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Performance Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get a quick overview of your trading performance with key metrics and recent 
              trades displayed in an intuitive dashboard.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/" className="flex justify-between items-center">
                View Dashboard <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Why Keep a Trading Journal?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Successful traders know that maintaining a detailed trading journal is one of the 
            most powerful tools for improvement. Here's why journaling is essential:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Identify patterns</strong> - Discover what setups work best for you
            </li>
            <li>
              <strong>Track progress</strong> - Measure improvements in your trading over time
            </li>
            <li>
              <strong>Maintain discipline</strong> - Build consistency by reviewing your decisions
            </li>
            <li>
              <strong>Learn from mistakes</strong> - Analyze losing trades to avoid repeating errors
            </li>
            <li>
              <strong>Optimize strategies</strong> - Refine your approach based on historical results
            </li>
          </ul>
          <div className="mt-6 text-center">
            <Button asChild size="lg">
              <Link to="/add-trade">Start Journaling Now</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
