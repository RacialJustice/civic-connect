import { Container } from './ui/container'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail,
  MapPin,
  Phone 
} from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <Container>
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">CivicConnect</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Empowering communities through digital civic engagement.
            </p>
          </div>

          <div>
            <h4 className="font-medium">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Contact Info</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                123 Civic Street, City
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                info@civicconnect.com
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Follow Us</h4>
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center border-t py-6 md:flex-row md:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CivicConnect. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-4 text-sm text-muted-foreground md:mt-0">
            <Link to="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}