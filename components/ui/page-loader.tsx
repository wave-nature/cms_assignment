'use client";';
import { Spinner } from "./spinner";

export default function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  );
}
