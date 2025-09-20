import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { featuresData } from '@/data/home_data';

function Features() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <h2 className="sub-heading">
        Everything you need to manage your finances
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 lg:gap-12 mt-5 mb-10">
        {featuresData.map((feature) => {
          const { title, description, icon, titleClass, descClass } = feature;
          return (
            <Card key={title} className="w-full">
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

export default Features;
