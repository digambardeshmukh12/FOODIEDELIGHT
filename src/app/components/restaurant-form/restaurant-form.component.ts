import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css']
})
export class RestaurantFormComponent {
  restaurantForm!: FormGroup;
  isEditMode = false;
  restaurantId!: string;

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.restaurantForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      rating: ['', Validators.required],
       menu: this.fb.array([])
    });

    this.restaurantId = this.route.snapshot.params['id'];
    if (this.restaurantId) {
      this.isEditMode = true;
      this.loadRestaurant();
    }
  }

  loadRestaurant(): void {
    this.restaurantService.getRestaurant(this.restaurantId).subscribe(
      (data: Restaurant) => {
        this.restaurantForm.patchValue(data);
      },
      error => {
        console.error('Error loading restaurant:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.restaurantForm.invalid) {
      return;
    }

    const restaurantData = this.restaurantForm.value;

    if (this.isEditMode) {
      this.restaurantService.updateRestaurant(this.restaurantId, restaurantData).subscribe(
        () => this.router.navigate(['/restaurants']),
        error => console.error('Error updating restaurant:', error)
      );
    } else {
      this.restaurantService.addRestaurant(restaurantData).subscribe(
        () => this.router.navigate(['/restaurants']),
        error => console.error('Error adding restaurant:', error)
      );
    }
  }

  

}