import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  saveShippingAdress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps.jsx";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAdress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container  mx-auto px-4 py-8 mt-[3rem] md:px-[2rem]">
      <div className="max-w-xl mx-auto">
        <ProgressSteps step1 step2 />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Shipping Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="Enter postal code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="Enter country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    defaultValue="PayPal"
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PayPal" id="paypal" />
                      <Label htmlFor="paypal" className="cursor-pointer">
                        PayPal or Credit Card
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Continue to Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Shipping;
