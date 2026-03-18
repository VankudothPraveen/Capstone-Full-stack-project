import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sentimental-impact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-24 bg-gray-50 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          
          <!-- Text Content -->
          <div class="space-y-8">
            <div>
              <p class="text-primary-maroon text-sm font-semibold uppercase tracking-widest mb-3">Your Child's Legacy</p>
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark-gray leading-tight">
                Don't Let Finance Be a Barrier to<br/>
                <span class="text-primary-maroon italic font-serif">A Lifetime of Dreams</span>
              </h2>
            </div>
            
            <p class="text-lg text-medium-gray leading-relaxed max-w-xl">
              Every child carries a world of potential. Whether they dream of being a doctor, a scientist, or an artist, their journey shouldn't be limited by the uncertainties of life.
            </p>

            <div class="space-y-4">
              <div class="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 transform hover:scale-[1.02] transition-transform">
                <div class="w-12 h-12 rounded-xl bg-accent-gold/10 flex items-center justify-center flex-shrink-0 text-accent-gold">
                   <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>
                </div>
                <div>
                  <h4 class="font-bold text-dark-gray text-base">Emotional Security</h4>
                  <p class="text-xs text-medium-gray mt-1">Knowing their future is protected gives you and your child peace of mind today.</p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 transform hover:scale-[1.02] transition-transform">
                <div class="w-12 h-12 rounded-xl bg-primary-maroon/10 flex items-center justify-center flex-shrink-0 text-primary-maroon">
                   <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l7 3a1 1 0 00.788 0l7-3a1 1 0 000-1.848l-7-3zM3.94 6L10 8.6l6.06-2.6L10 3.4 3.94 6zM5.277 10.374a1 1 0 01.332 1.359 7.917 7.917 0 00-.503 2.162l-1.001.104a8.914 8.914 0 01.594-2.583 1 1 0 011.578-.042zm10.706 1.359a1 1 0 111.91-.594 8.914 8.914 0 01.594 2.583l-1.001-.104a7.917 7.917 0 00-.503-2.162 1 1 0 01.332-1.359zM9 13.5v-1a1 1 0 012 0v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H8a1 1 0 110-2h1z"></path></svg>
                </div>
                <div>
                  <h4 class="font-bold text-dark-gray text-base">Guaranteed Growth</h4>
                  <p class="text-xs text-medium-gray mt-1">Our plans grow with your child, ensuring the fund is ready exactly when they need it.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Image Grid -->
          <div class="relative">
             <div class="absolute -top-12 -right-12 w-64 h-64 bg-accent-gold/20 rounded-full blur-3xl opacity-50"></div>
             <div class="absolute -bottom-12 -left-12 w-64 h-64 bg-primary-maroon/20 rounded-full blur-3xl opacity-50"></div>
             
             <div class="grid grid-cols-2 gap-4 relative">
                <div class="space-y-4">
                   <!-- Father and child joyful moment - deeply emotional -->
                   <img src="/father_child_joy.png" class="rounded-3xl shadow-2xl object-cover h-64 w-full" alt="Father and child sharing a joyful moment" />
                   <!-- Library / child reading - keeps the good image -->
                   <img src="https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop" class="rounded-3xl shadow-2xl object-cover h-48 w-full" alt="Child in library reading" />
                </div>
                <div class="space-y-4 pt-12">
                   <!-- Child writing at school - cute and emotional -->
                   <img src="/child_writing_school.png" class="rounded-3xl shadow-2xl object-cover h-48 w-full" alt="Child happily writing at school" />
                   <!-- Proud graduate - aspirational dream fulfilled -->
                   <img src="/graduation_proud.png" class="rounded-3xl shadow-2xl object-cover h-64 w-full" alt="Proud graduate with parents" />
                </div>
             </div>

             <!-- Floating Quote -->
             <div class="absolute -bottom-8 right-8 bg-white p-6 rounded-2xl shadow-2xl max-w-[240px] border border-gray-50 transform rotate-3 hover:rotate-0 transition-transform">
                <p class="text-sm font-serif italic text-dark-gray mb-3">"The greatest legacy we can leave our children is the opportunity to learn."</p>
                <div class="flex items-center gap-2">
                   <div class="w-6 h-px bg-primary-maroon"></div>
                   <span class="text-[10px] font-bold uppercase tracking-wider text-primary-maroon">Our Mission</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class SentimentalImpactComponent {}
