import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css']
})
export class RestaurantDetailsComponent {
  restaurant: Restaurant | null = null;
  menuForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {
    this.menuForm = this.fb.group({
      menuItem: ['', Validators.required],
      menurate: [0, Validators.required]

    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.restaurantService.getRestaurant(id).subscribe(
      (data) => this.restaurant = data,
      (error) => console.error('Error fetching restaurant details', error)
    );
  }

  goBack(): void {
    this.router.navigate(['/restaurants']);
  }

  addMenuItem(): void {
    debugger
    if (this.menuForm.valid && this.restaurant) {
      const newItem = this.menuForm.value.menuItem;
      const itemrate = this.menuForm.value.menurate;
      this.restaurant.menu = this.restaurant.menu || [];
      const newMenu = {
        item : newItem,
        rate : itemrate
      }
      this.restaurant.menu.push(newMenu);

      this.restaurantService.updateRestaurant2(this.restaurant).subscribe(
        () => {
          this.menuForm.reset();
          console.log('Menu item added successfully');
        },
        (error) => console.error('Error updating restaurant', error)
      );
    }
  }


 


  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      const imagePromises = files.map(file => this.convertToBase64(file));
      
      Promise.all(imagePromises).then(base64Images => {
        if (this.restaurant) {
          this.restaurant.images = this.restaurant.images || [];
          this.restaurant.images.push(...base64Images);

          // Update the restaurant in the backend
          this.restaurantService.updateRestaurant2(this.restaurant).subscribe(
            () => console.log('Images updated successfully'),
            (error) => console.error('Error updating images', error)
          );
        }
      });
    }
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}