import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t mt-12 pb-24 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex justify-center gap-4 mb-8">
          {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
            <a key={i} href="#" className="text-brand hover:opacity-70"><Icon className="h-5 w-5" /></a>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="font-bold text-brand mb-3">Quick Link</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Football</li><li>Transfer</li><li>Fan Zone</li><li>Historical Record</li><li>Latest News</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-brand mb-3">Important</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Contact us</li><li>News</li><li>Leagues</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-brand mb-3">Contact Us</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>For Subscription / general queries:</li>
              <li>✉ support@fnigeria.com</li>
              <li>☎ +234 800 000 0000</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-xs text-muted-foreground flex justify-between flex-wrap gap-2">
          <span>Copyright © 2024. All rights reserved</span>
          <span>All rights reserved with Football Nigeria · Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}
