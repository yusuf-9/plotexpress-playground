import { useCallback, useMemo } from "react";

interface Car<Brand = string, T = object> {
  make: Brand;
  model: string;
  year: number;
  engineSize: number;
  customFeatures: T;
}

type TeslaCar = Car<
  "tesla",
  {
    autopilotVersion: string;
    batteryCapacity: number;
    superchargeSpeed: number;
  }
>;

type PorscheCar = Car<
  "porsche",
  {
    pdk: boolean;
    sportChronoPackage: boolean;
    ceramicBrakes: boolean;
  }
>;

type AllowedCars = TeslaCar | PorscheCar;

interface CarFactory {
  washCar: (car: AllowedCars) => void;
}

class GenericCarModel implements CarFactory {
  washCar(car: AllowedCars) {
    console.log("washing generic car", car);
  }
}
interface TeslaCarFactory {
  washCar: (car: TeslaCar['customFeatures']) => void;
}

class TeslaModel implements TeslaCarFactory {
  washCar(car: TeslaCar['customFeatures']) {
    console.log("washing tesla car", car);
  }
}

interface PorscheCarFactory {
  washCar: (car: PorscheCar['customFeatures']) => void;
}

class PorscheModel implements PorscheCarFactory {
  washCar(car: PorscheCar['customFeatures']) {
    console.log("washing porsche car", car);
  }
}

export const CarItem: React.FC<{ car: AllowedCars }> = ({ car }) => {
  const carModel = useMemo(() => {
    switch (car.make) {
      case "tesla":
        return new TeslaModel();
      case "porsche":
        return new PorscheModel();
      default:
        return new GenericCarModel();
    }
  }, [car.make]);

  const washCar = useCallback(() => {
    if (car.make === "tesla") {
      (carModel as TeslaModel).washCar(car.customFeatures);
    } else if (car.make === "porsche") {
      (carModel as PorscheModel).washCar(car.customFeatures);
    } else {
      (carModel as GenericCarModel).washCar(car);
    }
  }, [carModel, car]);

  return (
    <div>
      <h1>{car.make}</h1>
      <button onClick={washCar}>Wash Car</button>
    </div>
  );
};
