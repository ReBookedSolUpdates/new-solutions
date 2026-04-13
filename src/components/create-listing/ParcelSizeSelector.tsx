import { Package } from 'lucide-react';
import { PARCEL_SIZES, ParcelSizeKey } from '@/constants/parcelSizes';
import { cn } from '@/lib/utils';

interface ParcelSizeSelectorProps {
  value: ParcelSizeKey | '';
  onChange: (size: ParcelSizeKey) => void;
  error?: string;
}

export const ParcelSizeSelector = ({ value, onChange, error }: ParcelSizeSelectorProps) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-base font-medium flex items-center gap-2">
          <Package className="h-4 w-4 text-book-600" />
          Parcel Size <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mt-0.5">
          Select the size that best fits your item. This is used to calculate courier &amp; locker rates.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
        {PARCEL_SIZES.map((parcel) => {
          const isSelected = value === parcel.key;
          return (
            <button
              key={parcel.key}
              type="button"
              onClick={() => onChange(parcel.key)}
              className={cn(
                'relative flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all duration-150 hover:border-book-400 focus:outline-none focus:ring-2 focus:ring-book-500 focus:ring-offset-1',
                isSelected
                  ? 'border-book-600 bg-book-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:bg-gray-50',
                error && !isSelected ? 'border-red-200' : ''
              )}
              aria-pressed={isSelected}
            >
              {/* Selection indicator */}
              <div
                className={cn(
                  'mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors',
                  isSelected
                    ? 'border-book-600 bg-book-600'
                    : 'border-gray-300'
                )}
              >
                {isSelected && (
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn('font-semibold text-sm', isSelected ? 'text-book-800' : 'text-gray-900')}>
                    {parcel.label}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap',
                      isSelected
                        ? 'bg-book-100 text-book-700'
                        : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {parcel.weight}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">{parcel.dimensions}</p>
                <p className="text-xs text-gray-500 mt-0.5">{parcel.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};
