import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import usePlacesLibrary from '@/hooks/usePlacesLibrary';

export interface AddressData {
  formattedAddress: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  additional_info?: string;
}

interface GooglePlacesAutocompleteProps {
  onAddressSelect: (addressData: AddressData) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  defaultValue?: Partial<AddressData>;
}

const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
  'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape',
];

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  onAddressSelect, label = 'Address', placeholder = 'Start typing an address...',
  required = false, error, className = '', defaultValue = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  const { isLoaded: placesLoaded, error: placesError } = usePlacesLibrary();

  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);
  const [inputValue, setInputValue] = useState(defaultValue?.formattedAddress || '');
  const [isInitializing, setIsInitializing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const extractAddressData = async (placeId: string): Promise<AddressData | null> => {
    try {
      const places = window.google?.maps?.places as any;
      if (!places?.Place) {
        throw new Error('Places API not available');
      }

      const place = new places.Place({ id: placeId });
      await place.fetchFields({ fields: ['formattedAddress', 'addressComponents'] });

      if (!place.formattedAddress) {
        throw new Error('Could not fetch place details');
      }

      let street = '', city = '', province = '', postalCode = '';

      if (place.addressComponents) {
        for (const component of place.addressComponents) {
          const type = component.types?.[0];
          if (type === 'street_number') street = (component.longText || component.long_name || '') + ' ';
          else if (type === 'route') street += (component.longText || component.long_name || '');
          else if (type === 'locality') city = component.longText || component.long_name || '';
          else if (type === 'administrative_area_level_1') province = component.longText || component.long_name || '';
          else if (type === 'postal_code') postalCode = component.longText || component.long_name || '';
        }
      }

      const normalizedProvince = SA_PROVINCES.find(
        (p) => p.toLowerCase().includes(province.toLowerCase()) || province.toLowerCase().includes(p.toLowerCase()),
      ) || province;

      return {
        formattedAddress: place.formattedAddress,
        street: street.trim() || place.formattedAddress.split(',')[0],
        city: city || '',
        province: normalizedProvince || '',
        postalCode: postalCode || '',
        country: 'South Africa',
      };
    } catch {
      return null;
    }
  };

  const initializeAutocomplete = async () => {
    if (!placesLoaded || !containerRef.current || isInitializing) return;

    setIsInitializing(true);
    try {
      const places = window.google?.maps?.places as any;
      const AutocompleteElement = places?.PlaceAutocompleteElement || places?.BasicPlaceAutocompleteElement;

      if (!AutocompleteElement) {
        throw new Error('PlaceAutocompleteElement not available');
      }

      autocompleteRef.current = new AutocompleteElement({
        includedRegionCodes: ['za'],
      });

      autocompleteRef.current.addEventListener('gmp-placeselect', async (event: any) => {
        const place = event?.place || autocompleteRef.current?.value;
        const placeId = typeof place === 'string' ? place : place?.id;
        if (!placeId) return;

        try {
          const addressData = await extractAddressData(placeId);
          if (addressData) {
            setSelectedAddress(addressData);
            setInputValue(addressData.formattedAddress);
            onAddressSelect(addressData);
            setLocalError(null);
          } else {
            setLocalError('Could not extract address details. Please try again.');
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Unknown error';
          setLocalError(`Failed to process address: ${errorMsg}`);
        }
      });

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(autocompleteRef.current);
      }

      setIsInitializing(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setLocalError(`Failed to initialize autocomplete: ${errorMsg}`);
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (placesLoaded && !placesError) {
      initializeAutocomplete();
    }
  }, [placesLoaded, placesError]);

  useEffect(() => {
    if (defaultValue?.formattedAddress) {
      setInputValue(defaultValue.formattedAddress);
      setSelectedAddress(defaultValue as AddressData);
    }
  }, []);

  if (!placesLoaded && !placesError) {
    return (
      <div className={`space-y-4 ${className}`}>
        {label && (
          <Label className="text-base font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Loading address search...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayError = placesError || localError || error;

  if (placesError && !placesLoaded) {
    return (
      <div className={`space-y-4 ${className}`}>
        {label && (
          <Label className="text-base font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Address search is temporarily unavailable. Please enter your address manually.
          </AlertDescription>
        </Alert>
        <Card>
          <CardContent className="p-4">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter your full address manually..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={error ? 'border-destructive' : ''}
              required={required}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <Label className="text-base font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Card>
        <CardContent className="p-4">
          <div ref={containerRef} className="w-full" />
          <p className="text-xs text-muted-foreground mt-2">
            Start typing your address and select from the suggestions
          </p>
        </CardContent>
      </Card>
      {displayError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}
      {selectedAddress && (
        <Card className="bg-accent/20 border-accent">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Selected Address:</p>
                <p className="text-sm text-muted-foreground">{selectedAddress.formattedAddress}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                  <span><strong>City:</strong> {selectedAddress.city}</span>
                  <span><strong>Province:</strong> {selectedAddress.province}</span>
                  <span><strong>Postal:</strong> {selectedAddress.postalCode}</span>
                  <span><strong>Country:</strong> {selectedAddress.country}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;
