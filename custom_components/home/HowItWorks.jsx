import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { howItWorksData } from '@/data/home_data';

function HowItWorks() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <h2 className="sub-heading">How It Works</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 lg:gap-12 mt-5 mb-10 justify-items-center">
        {howItWorksData.map((feature) => {
          const { title, description, icon, titleClass, descClass } = feature;
          return (
            <Card key={title} className="w-full md:max-w-xl">
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="flex gap-3 items-center justify-center">
                    {icon}
                    <span className={titleClass}>{title}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={descClass}>{description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default HowItWorks;
